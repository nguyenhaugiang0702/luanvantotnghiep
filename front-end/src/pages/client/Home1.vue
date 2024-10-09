<script setup>
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Calendar, ShoppingCart, Users } from "lucide-react";

const featuredProducts = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 14.99,
    cover: "/placeholder.svg?height=400&width=300",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 16.99,
    cover: "/placeholder.svg?height=400&width=300",
  },
  {
    title: "The Song of Achilles",
    author: "Madeline Miller",
    price: 13.99,
    cover: "/placeholder.svg?height=400&width=300",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 15.99,
    cover: "/placeholder.svg?height=400&width=300",
  },
];
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <header class="bg-primary text-white">
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="text-white">Bookworm's Haven</h1>
          <nav>
            <ul class="nav">
              <li class="nav-item"><a href="#" class="nav-link text-white">Home</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">Books</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">Events</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">About</a></li>
              <li class="nav-item"><a href="#" class="nav-link text-white">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-grow-1">
      <!-- Hero Section -->
      <section class="bg-light text-center py-5">
        <div class="container">
          <h2 class="display-4">Discover Your Next Great Read</h2>
          <p class="lead">Explore our vast collection of books for every reader</p>
          <Button class="btn btn-lg btn-primary">Browse Catalog</Button>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-5">Featured Books</h2>
          <div class="row">
            <div v-for="(book, index) in featuredProducts" :key="index" class="col-lg-3 col-md-6 mb-4">
              <Card>
                <CardHeader>
                  <img :src="book.cover" :alt="book.title" class="img-fluid" />
                </CardHeader>
                <CardContent>
                  <CardTitle>{{ book.title }}</CardTitle>
                  <p class="text-muted">{{ book.author }}</p>
                  <p class="font-weight-bold">${{ book.price.toFixed(2) }}</p>
                </CardContent>
                <CardFooter>
                  <Button class="btn btn-primary w-100">
                    <ShoppingCart class="mr-2" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Categories -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">Featured Categories</h2>
          <div class="row">
            <div v-for="(category, index) in ['Fiction', 'Non-Fiction', 'Children\'s', 'Sci-Fi & Fantasy']" :key="index" class="col-lg-3 col-md-6 mb-4">
              <Card class="text-center">
                <CardHeader>
                  <CardTitle>{{ category }}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" class="btn btn-outline-primary">Explore {{ category }}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Events -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-5">Upcoming Events</h2>
          <div class="row">
            <div class="col-lg-4 col-md-6 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle>Author Meet & Greet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Join us for an evening with bestselling author Jane Doe.</p>
                  <p><Calendar class="mr-2" /> June 15, 2023</p>
                </CardContent>
              </Card>
            </div>
            <div class="col-lg-4 col-md-6 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle>Book Club Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This month we're discussing "The Great Gatsby" by F. Scott Fitzgerald.</p>
                  <p><Calendar class="mr-2" /> June 22, 2023</p>
                </CardContent>
              </Card>
            </div>
            <div class="col-lg-4 col-md-6 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle>Children's Story Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Bring your little ones for an hour of enchanting stories.</p>
                  <p><Calendar class="mr-2" /> Every Saturday</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <!-- About Us -->
      <section class="py-5 bg-light text-center">
        <div class="container">
          <h2 class="text-center mb-5">Why Choose Bookworm's Haven?</h2>
          <div class="row">
            <div class="col-md-4">
              <BookOpen class="mb-3 text-primary" />
              <h4>Vast Selection</h4>
              <p>Over 100,000 titles across all genres</p>
            </div>
            <div class="col-md-4">
              <Users class="mb-3 text-primary" />
              <h4>Expert Staff</h4>
              <p>Knowledgeable booksellers to assist you</p>
            </div>
            <div class="col-md-4">
              <Calendar class="mb-3 text-primary" />
              <h4>Regular Events</h4>
              <p>Author signings, book clubs, and more</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <section class="bg-primary text-white text-center py-5">
        <div class="container">
          <h2 class="mb-4">Stay Updated</h2>
          <p class="mb-4">Subscribe to our newsletter for the latest book releases and event updates</p>
          <form class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Input type="email" placeholder="Enter your email" class="form-control" />
            <Button type="submit" class="btn btn-secondary">Subscribe</Button>
          </form>
        </div>
      </section>
    </main>

    <footer class="bg-light py-4 text-center">
      <div class="container">
        <p>&copy; 2023 Bookworm's Haven. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
