import avatar from "../../public/avatar.jpg";

export interface PostsProp {
   title: string;
   author: string;
   user_img: string;
   date: string;
}

export const posts: Array<PostsProp> = [
   {
      title: "Exploring the Wonders of Nature",
      author: "John Smith",
      user_img: "/alex.jpg",
      date: "September 2, 2023",
   },
   {
      title: "The Art of Culinary Delights",
      author: "Alice Johnson",
      user_img: "/alex.jpg",
      date: "August 28, 2023",
   },
   {
      title: "A Journey Through Time and Space",
      author: "David Williams",
      user_img: "/alex.jpg",
      date: "July 15, 2023",
   },
   {
      title: "Unlocking the Mysteries of the Mind",
      author: "Emily Davis",
      user_img: "/alex.jpg",
      date: "June 30, 2023",
   },
   {
      title: "Adventures in the Digital Realm",
      author: "Michael Brown",
      user_img: "/alex.jpg",
      date: "May 12, 2023",
   },
   {
      title: "The Power of Innovation and Technology",
      author: "Sophia Lee",
      user_img: "/alex.jpg",
      date: "April 5, 2023",
   },
];
