import { db } from "~/server/db";

async function setup() {
  // Check if books already exist to avoid duplicates
  const existingBooks = await db.book.count();
  
  if (existingBooks === 0) {
    console.log("Adding sample books...");
    
    await db.book.createMany({
      data: [
        {
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          publicationYear: 1937,
          readStatus: "read",
          rating: 5,
          notes: "A delightful adventure story that started my love for fantasy literature. The world-building is incredible and Bilbo's journey is both exciting and heartwarming.",
        },
        {
          title: "Atomic Habits",
          author: "James Clear",
          genre: "Self-Help",
          publicationYear: 2018,
          readStatus: "reading",
          rating: 4,
          notes: "Great practical advice on building good habits and breaking bad ones. The 1% improvement concept is really powerful.",
        },
        {
          title: "Dune",
          author: "Frank Herbert",
          genre: "Science Fiction",
          publicationYear: 1965,
          readStatus: "to-read",
          notes: "Heard amazing things about this epic space opera. Looking forward to diving into the complex world of Arrakis.",
        },
        {
          title: "The Midnight Library",
          author: "Matt Haig",
          genre: "Fiction",
          publicationYear: 2020,
          readStatus: "read",
          rating: 3,
          notes: "Interesting concept about parallel lives and choices. A bit philosophical but overall an engaging read.",
        },
        {
          title: "Educated",
          author: "Tara Westover",
          genre: "Memoir",
          publicationYear: 2018,
          readStatus: "read",
          rating: 5,
          notes: "Absolutely incredible memoir about education, family, and finding your own path. Couldn't put it down.",
        },
      ],
    });
    
    console.log("Sample books added successfully!");
  } else {
    console.log(`Database already contains ${existingBooks} books, skipping sample data.`);
  }
}

setup()
  .then(() => {
    console.log("setup.ts complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
