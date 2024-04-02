document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list");
    const newQuoteForm = document.getElementById("new-quote-form");
    const baseURL = "http://localhost:3000/quotes";
  
    // Fetch quotes from server and populate the page
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`${baseURL}?_embed=likes`);
        const quotes = await response.json();
  
        quotes.forEach(quote => {
          displayQuote(quote);
        });
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };
  
    // Display a quote card on the page
    const displayQuote = (quote) => {
      const quoteCard = document.createElement("li");
      quoteCard.classList.add("quote-card");
      quoteCard.innerHTML = `
        <blockquote>
          <p>${quote.text}</p>
          <footer>${quote.author}</footer>
          <button class="btn-like">Like</button>
          <button class="btn-delete">Delete</button>
        </blockquote>
      `;
  
      const likeBtn = quoteCard.querySelector(".btn-like");
      likeBtn.addEventListener("click", () => likeQuote(quote));
  
      const deleteBtn = quoteCard.querySelector(".btn-delete");
      deleteBtn.addEventListener("click", () => deleteQuote(quote.id));
  
      quoteList.appendChild(quoteCard);
    };
  
    // Add a new quote to the server and update the page
    const addQuote = async (quoteText, quoteAuthor) => {
      try {
        const response = await fetch(baseURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ text: quoteText, author: quoteAuthor })
        });
  
        const newQuote = await response.json();
        displayQuote(newQuote);
      } catch (error) {
        console.error("Error adding quote:", error);
      }
    };
  
    // Like a quote and update the server and page
    const likeQuote = async (quote) => {
      try {
        const response = await fetch("http://localhost:3000/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ quoteId: quote.id })
        });
  
        const newLike = await response.json();
        const likeBtn = quoteList.querySelector(`[data-quote-id="${quote.id}"] .btn-like`);
        likeBtn.textContent = `Likes: ${newLike.length}`;
      } catch (error) {
        console.error("Error liking quote:", error);
      }
    };
  
    // Delete a quote from the server and page
    const deleteQuote = async (quoteId) => {
      try {
        await fetch(`${baseURL}/${quoteId}`, {
          method: "DELETE"
        });
  
        const quoteCard = quoteList.querySelector(`[data-quote-id="${quoteId}"]`);
        quoteCard.remove();
      } catch (error) {
        console.error("Error deleting quote:", error);
      }
    };
  
    // Event listener for form submission to add new quote
    newQuoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const quoteText = document.getElementById("quote-text").value;
      const quoteAuthor = document.getElementById("quote-author").value;
  
      if (quoteText && quoteAuthor) {
        addQuote(quoteText, quoteAuthor);
        newQuoteForm.reset();
      } else {
        alert("Please enter both quote text and author.");
      }
    });
  
    // Initial fetch and setup
    fetchQuotes();
  });
  