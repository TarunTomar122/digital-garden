import type { Party } from "partykit";

export default class Server implements Party.Server {
  constructor(readonly party: Party) {}

  onConnect(conn: Party.Connection) {
    conn.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data as string);
        if (data.t === "cursor") {
          // Broadcast to all EXCEPT sender
          for (const c of this.party.getConnections()) {
            if (c.id !== conn.id) {
              c.send(JSON.stringify({ t: "cursor", id: conn.id, x: data.x, y: data.y }));
            }
          }
        }
      } catch {}
    };

    conn.onclose = () => {
      this.party.broadcast(JSON.stringify({ t: "leave", id: conn.id }));
    };
  }
}


