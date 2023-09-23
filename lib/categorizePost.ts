import natural from "natural";
import { htmlToText, HtmlToTextOptions } from "html-to-text";

const tokenizer = new natural.WordTokenizer();

function preprocessText(text: string): string[] {
   // Convert HTML to plain text
   const plainText = htmlToText(text, {
      ignoreHref: true, // Ignore links
      ignoreImage: true, // Ignore images
   } as HtmlToTextOptions); // Use type assertion here

   // Tokenize the plain text
   return tokenizer.tokenize(plainText.toLowerCase()) || [];
}

// Function to categorize a post based on content
async function categorizePost(data: any, categories: any[]) {
   const contentText = data.content || "";
   const contentTokens: string[] = preprocessText(contentText);
   const categoryScores: Record<string, number> = {};

   // Calculate similarity scores for each category
   for (const category of categories) {
      const categoryKeywords: string[] = preprocessText(category.name);
      const score: number = natural.JaroWinklerDistance(
         contentTokens.join(" "),
         categoryKeywords.join(" "),
         {}
      );

      categoryScores[category.name] = score; // Assign category name instead of id
   }

   // Set a threshold for the similarity score to consider a category
   const similarityThreshold = 0.7;

   // Find the category with the highest score
   const highestScoreCategory: string = Object.keys(categoryScores).reduce(
      (a, b) => (categoryScores[a] > categoryScores[b] ? a : b)
   );

   // Check if the highest score is above the threshold
   if (categoryScores[highestScoreCategory] >= similarityThreshold) {
      // Set the category_name of the post to the name of the highest scoring category
      data.category_name = highestScoreCategory;
   } else {
      // If no category meets the threshold, log an error message
      console.error("No category meets the similarity threshold.");

      // You can handle this case according to your needs.
      // For example, you can create a "Default" category and set the category_name to it.
   }
}

export { categorizePost };
