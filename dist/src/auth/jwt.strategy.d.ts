import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: any): Promise<{
        role: any;
        id: string;
        email: string;
        name: string | null;
        isAgent: boolean;
        timezone: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
}
export {};
