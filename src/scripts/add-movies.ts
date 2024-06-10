import { InsertMovie, movies } from '@/db/schema';
import { createClient } from '@/utils/supabase/server'; 

async function main() {
  const supabase = createClient();

  try {
    const moviesToAdd: InsertMovie[] = [
      {
        name: 'The Shawshank Redemption',
        summary: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        category: 'Drama',
        director: 'Frank Darabont',
        castMembers: 'Tim Robbins, Morgan Freeman',
      },
      {
        name: 'The Godfather',
        summary: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        category: 'Crime, Drama',
        director: 'Francis Ford Coppola',
        castMembers: 'Marlon Brando, Al Pacino, James Caan',
      },
    ];

    const { data, error } = await supabase
      .from('movies')
      .insert(moviesToAdd)
      .select();

    if (error) {
      console.error("Error adding movies:", error);
    } else {
      console.log("Movies added successfully:", data);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main();
