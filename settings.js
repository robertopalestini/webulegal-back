exports.secure = {
    base_url: '',
    vendors: true,
    jwtSecret: '123iosdzxu234',
    db: {
        host: '127.0.0.1',
        protocol: 'http',
        port: 5984,
        auth: {
            user: 'admin',
            password: '43119739Ramiro'
        }
    },
    mongodb: {
        host: 'webulegal.com',
        port: '27017',
        auth: {
            username: 'webu',
            password: '43119739Ramiro'
        }
    },
    py: {
        scriptPath: '../../',
    },
    mercadopago: {
        access_token: 'TEST-4429557015917371-091016-92847a7bc6742ac4c4e8decfb599385f-61705764',
        back_urls: {
            success: "https://webulegal.com/api/payments/callback",
            error: "https://webulegal.com/api/payments/callback",
        }
    }

}