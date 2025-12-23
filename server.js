const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.use(express.static(__dirname));

const rooms = {};

// Utils
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // --- LOBBY LOGIC ---
    socket.on('create_room', ({ playerName }) => {
        const code = generateRoomCode();
        rooms[code] = {
            players: [],
            status: 'waiting',
            currentQuestionIndex: 0,
            hostId: null // We will set persistent ID
        };
        // Initial join handled by 'join_room' immediately after
        socket.emit('room_created', code);
    });

    socket.on('join_room', ({ code, playerName, persistentId }) => {
        code = code?.toUpperCase();
        if (!rooms[code]) {
            socket.emit('error', "Salle introuvable.");
            return;
        }

        const room = rooms[code];
        let player = room.players.find(p => p.persistentId === persistentId);

        if (!player) {
            // New Player
            if (room.status !== 'waiting') {
                socket.emit('error', "La partie a déjà commencé.");
                return;
            }
            player = {
                id: socket.id,
                persistentId: persistentId || socket.id, // Use provided ID or socket ID
                name: playerName,
                score: 0
            };
            room.players.push(player);
            if (room.players.length === 1) room.hostId = player.persistentId;
        } else {
            // Reconnection
            player.id = socket.id; // Update socket ID
            console.log(`Player ${playerName} reconnected to ${code}`);
        }

        socket.join(code);
        socket.emit('joined_room', { code, persistentId: player.persistentId, isHost: room.hostId === player.persistentId });
        io.to(code).emit('update_lobby', room.players);
    });

    socket.on('start_game_request', (code) => {
        const room = rooms[code];
        if (room) {
            room.status = 'playing';
            io.to(code).emit('game_start_signal');

            // Start Question Loop
            setTimeout(() => {
                nextRound(code);
            }, 3000); // 3s delay before first Q to allow redirect
        }
    });

    // --- GAME LOGIC ---
    socket.on('reconnect_game', ({ code, persistentId }) => {
        const room = rooms[code];
        if (room) {
            const player = room.players.find(p => p.persistentId === persistentId);
            if (player) {
                player.id = socket.id;
                socket.join(code);
                console.log(`Game Reconnect: ${player.name}`);
                // Send current state
                socket.emit('sync_state', {
                    status: room.status,
                    players: room.players,
                    currentQuestionIndex: room.currentQuestionIndex
                });
            }
        }
    });

    socket.on('answer_submitted', ({ code, persistentId, isCorrect }) => {
        const room = rooms[code];
        if (room) {
            const player = room.players.find(p => p.persistentId === persistentId);
            if (player && isCorrect) {
                player.score++;
            }
            io.to(code).emit('update_scores', room.players);
        }
    });

    socket.on('disconnect', () => {
        // We don't remove players immediately to allow reconnection
        console.log('disconnect', socket.id);
    });
});

function nextRound(code) {
    const room = rooms[code];
    if (!room) return;

    room.currentQuestionIndex++;
    if (room.currentQuestionIndex > 10) {
        io.to(code).emit('game_over', room.players);
    } else {
        // Send just an index (0-195) or a seed. 
        // For V1, let's send a random index from 0 to 195 (World Dataset Size approx)
        const qIdx = Math.floor(Math.random() * 190);
        io.to(code).emit('next_question', { index: qIdx, round: room.currentQuestionIndex });

        // Auto next
        setTimeout(() => nextRound(code), 15000);
    }
}

server.listen(3000, () => {
    console.log('Server running on 3000');
});
