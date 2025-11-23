"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const fs_1 = require("fs");
let app;
async function bootstrap() {
    const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads', 'avatars');
    if (!(0, fs_1.existsSync)(uploadsDir)) {
        (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
    }
    app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        exposedHeaders: ['Content-Type', 'Content-Length'],
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
        setHeaders: (res) => {
            res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
            res.set('Access-Control-Allow-Credentials', 'true');
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
    }));
    await app.init();
    return app;
}
const handler = async (req, res) => {
    if (!app) {
        app = await bootstrap();
    }
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
};
exports.handler = handler;
if (require.main === module) {
    bootstrap().then((appInstance) => {
        appInstance.listen(process.env.PORT ?? 3001);
    });
}
//# sourceMappingURL=main.js.map