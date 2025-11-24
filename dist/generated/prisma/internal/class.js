"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.0.0",
    "engineVersion": "0c19ccc313cf9911a90d99d2ac2eb0280c76c513",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider        = \"prisma-client\" // or `prisma-client-js`\n  output          = \"../generated/prisma\"\n  engineType      = \"client\" // enable Prisma ORM without Rust\n  previewFeatures = []\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Email {\n  id        String   @id @default(uuid())\n  email     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Customer {\n  id             String    @id @default(uuid())\n  name           String\n  email          String    @unique\n  phone          String\n  timezone       String // Customer's timezone\n  companyDetails String?   @db.Text // Markdown content about the company\n  adminId        String? // Admin who created/manages this customer\n  admin          User?     @relation(\"CustomerAdmin\", fields: [adminId], references: [id], onDelete: SetNull)\n  source         String    @default(\"website\") // \"website\" (self-registered) or \"admin\" (added by admin)\n  level          String    @default(\"new\") // \"new\", \"contacted\", \"responded\", \"qualified\", \"customer\"\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n  meetings       Meeting[] // Meetings for this customer\n}\n\nmodel Meeting {\n  id               String   @id @default(uuid())\n  // Customer's time\n  customerDate     String // Date in customer's timezone (YYYY-MM-DD)\n  customerTime     String // Time in customer's timezone (HH:mm)\n  customerTimezone String // Customer's timezone\n  // Agent's time\n  agentDate        String? // Date in agent's timezone (YYYY-MM-DD)\n  agentTime        String? // Time in agent's timezone (HH:mm)\n  agentTimezone    String? // Agent's timezone\n  // Relations\n  customerId       String\n  customer         Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  agentId          String? // References User.id (admin role users are agents)\n  agent            User?    @relation(fields: [agentId], references: [id], onDelete: SetNull)\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  email     String     @unique\n  password  String\n  name      String?\n  role      String     @default(\"admin\") // \"admin\" or \"superadmin\"\n  isAgent   Boolean    @default(false) // Whether this user is an agent\n  timezone  String?    @default(\"Asia/Kuala_Lumpur\") // Timezone for agents\n  avatar    String? // URL or path to avatar image\n  isActive  Boolean    @default(true) // For agents to enable/disable\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  meetings  Meeting[] // Meetings assigned to this agent\n  customers Customer[] @relation(\"CustomerAdmin\") // Customers managed by this admin\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Email\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Customer\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"timezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"companyDetails\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"adminId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"admin\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CustomerAdmin\"},{\"name\":\"source\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"level\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"meetings\",\"kind\":\"object\",\"type\":\"Meeting\",\"relationName\":\"CustomerToMeeting\"}],\"dbName\":null},\"Meeting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerDate\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerTimezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"agentDate\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"agentTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"agentTimezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customer\",\"kind\":\"object\",\"type\":\"Customer\",\"relationName\":\"CustomerToMeeting\"},{\"name\":\"agentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"agent\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MeetingToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isAgent\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"timezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avatar\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"meetings\",\"kind\":\"object\",\"type\":\"Meeting\",\"relationName\":\"MeetingToUser\"},{\"name\":\"customers\",\"kind\":\"object\",\"type\":\"Customer\",\"relationName\":\"CustomerAdmin\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.js"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.js");
        return await decodeBase64AsWasm(wasm);
    }
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map