"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
let app;
async function bootstrap() {
    try {
        console.log('🔄 Starting bootstrap...');
        console.log('🔄 Creating NestJS application...');
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ NestJS application created');
        app.enableCors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            exposedHeaders: ['Content-Type', 'Content-Length'],
        });
        console.log('✅ CORS enabled');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            skipMissingProperties: false,
            skipNullProperties: false,
            skipUndefinedProperties: false,
        }));
        console.log('✅ Validation pipes configured');
        const port = process.env.PORT ?? 3001;
        console.log(`🔄 Starting server on port ${port}...`);
        await app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}`);
        return app;
    }
    catch (error) {
        console.error('❌ Error in bootstrap:', error);
        throw error;
    }
}
const handler = async (req, res) => {
    if (!app) {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            exposedHeaders: ['Content-Type', 'Content-Length'],
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
    }
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
};
exports.handler = handler;
bootstrap()
    .then((app) => {
    console.log('✅ Server started successfully');
})
    .catch((error) => {
    console.error('❌ Error starting server:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
});
//# sourceMappingURL=main.js.map