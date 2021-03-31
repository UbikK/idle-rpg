const Constants = {
    db_uri: process.env.DATABASE_URL || 'postgres://regrgunogsldpv:281ff8e771e4ea2a27b67e3803e889b1ed2ffdddab7970345e8a8743b8f328d0@ec2-34-247-118-233.eu-west-1.compute.amazonaws.com:5432/d2if2vinossmis',
    db_host: process.env.POSTGRES_HOST || 'ec2-34-247-118-233.eu-west-1.compute.amazonaws.com',
    db_database: process.env.POSTGRES_DB || 'd2if2vinossmis',
    db_user: process.env.POSTGRES_USER || 'regrgunogsldpv',
    db_password: process.env.POSTGRES_PASSWORD || '281ff8e771e4ea2a27b67e3803e889b1ed2ffdddab7970345e8a8743b8f328d0',
    jwt_secret: '69EaRRg8nyTRy5'
}
export enum CHAR_TYPE {ENEMY= 'enemy', PC='pc'};

export default Constants;