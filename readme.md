Comparison of socket.io and faye.

Benchmark:

- 1 server in one process
- 5000 clients in other process (each one estabilishes new connection to simulate real world)
- server broadcasts message every second (think game state)
- client sends message to server every 4 seconds

How to run:

cd faye
node fayeBench-server.js
(in new terminal)
node fayeBench-client.js

cd socket.io
node socketIoBench-server.js
(in new terminal)
node socketIoBench-client.js

My results (windows, dual core i5):

Faye:
- works, after longer time process with clients runs out of allocatable memory (even though memory consumption stays flat, is it because fragmentation? this likely wouldn't be problem with a single client).
- stable memory for server and client
- some clients are delayed or left behind after cca 220 runs:

{ server's run: number of clients that has seen such run as a last one }
{ '269': 1,
  '271': 408,
  '273': 871,
  '278': 391,
  '289': 694,
  '297': 49,
  '299': 1584,
  '300': 117,
  '470': 542,
  '480': 18,
  '486': 55,
  '487': 147,
  '488': 20,
  '489': 103 }


Socket.io
- I can't even get all clients to connect, few hundred always stay disconnected.
- after initial increase the memory usage stabilized
- some clients are left behind after cca 60 runs, then slowly most of them will catch up, there remains several hundred which will never connect or catch up

{ server's run: number of clients that has seen such run as a last one }
{ '68': 22,
  '69': 36,
  '70': 25,
  '71': 15,
  '72': 30,
  '73': 10,
  '80': 85,
  '97': 70,
  '117': 3339,
  '118': 1368 }
- after longer time, some clients crash inside socket.io code (problems with autoreconnect?)

![Image](https://dl.dropbox.com/u/75531/screenshots/2014-01/2014-01-02_14-29-15.png)