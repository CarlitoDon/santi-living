import "dotenv/config";
import { createServer } from "./server";

const PORT = process.env.PORT || 3002;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 erp-sync-service running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/orders`);
});
