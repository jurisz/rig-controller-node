
Simple mining rig info & scheduler to monitor/control restart rig with GPIO and relays
based on node and running on raspberry 

http://localhost:3000

dev 
npm start
npm run dev

https://api.thingspeak.com/channels/9/fields/2/last.json

echo '{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}' | netcat 192.168.2.160 3333
{"id": 0, "error": null, "result": ["11.0 - ETH", "15", "61565;9;0", "30781;30784", "0;0;0", "off;off", "66;57;64;31", "eth-eu1.nanopool.org:9999", "0;0;0;0"]}


===
reboot
{"id":0,"jsonrpc":"2.0","method":"miner_reboot"}

windows => reboot.bat
shutdown /r