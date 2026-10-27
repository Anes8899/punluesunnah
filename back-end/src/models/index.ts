// Every model is listed here so its collection exists at startup, even while empty.
// Add new models to this list.
import { Book } from "./Book";
import { Chapter } from "./Chapter";
import { Content } from "./Content";

export { Book, Chapter, Content };

export const models = [Book, Chapter, Content];
