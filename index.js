const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const typeDefs = gql`
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
    id: ID
    title: String
    author: String
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
    books: [Book]
    getBookById(bookId: ID): Book
}
type Mutation {
    addBook(title: String, author: String): Book
}
`

const books = [
    {
    id: 0,
    title: 'The Awakening',
    author: 'Kate Chopin',
    },
    {
    id: 1,
    title: 'City of Glass',
    author: 'Paul Auster',
    },
];
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
    books: () => books,
    getBookById: (_, args) => books.find((book) => book.id == args.bookId)
    },
    Mutation: {
        addBook: (_, args) => {
        const lastId = books.at(-1).id;
        const newId = lastId + 1;
        books.push({
            title: args.title,
            author: args.author,
            id: newId,
        });
        return books.at(-1);
        },
    },
};
const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});

  // The listen method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});