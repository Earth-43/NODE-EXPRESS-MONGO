if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI : 'mongodb+srv://majordomo:sa@cluster0-vmv5s.mongodb.net/test?retryWrites=true'
    }
} else {
    module.exports = {
        mongoURI : 'mongodb://localhost/nodeexpress-dev'
    }
}