import cassandra from "cassandra-driver";

const PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

const config = {
    host: "localhost",
    port: "9042",
    user: "cassandra",
    password: "cassandra"
}

const client = new cassandra.Client({
    contactPoints: [`${config.host}:${config.port}`],
    authProvider: new PlainTextAuthProvider(config.user, config.password),
    localDataCenter: 'datacenter1'
});

export default client;
