from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB 
client = MongoClient(MONGO_URI)
mongo_db = client[MONGO_DB] 
import psycopg2
from config import PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_PORT 

pg_conn = psycopg2.connect(
    host=PG_HOST,
    database=PG_DATABASE,
    user=PG_USER,
    password=PG_PASSWORD,
    port=PG_PORT
) 
pg_cursor = pg_conn.cursor() 

def transform_data(book):
    # Convert MongoDB document to a format suitable for PostgreSQL
    return {
        "_id": str(book.get("_id")),
        "__v": book.get("__v", 0),
        "authors": book.get("authors", ""),
        "bookID": book.get("bookID", ""),
        "bookName": book.get("bookName", ""),
        "category": book.get("category", ""),
        "edition": book.get("edition", ""),
        "ISBN": book.get("ISBN", ""),
        "year": book.get("year", "")
    }

def migrate_books():
    books_collection = mongo_db["books"]
    books = books_collection.find()
    
    for book in books:
        transformed_data = transform_data(book)
        query = """
        INSERT INTO books (_id, __v, authors, bookid, bookname, category, edition, isbn, year)  
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)  
        ON CONFLICT (_id) DO NOTHING;
        """ 
        try:  
            pg_cursor.execute(query, (
                transformed_data["_id"],
                transformed_data["__v"],
                transformed_data["authors"],
                transformed_data["bookID"],
                transformed_data["bookName"],
                transformed_data["category"],
                transformed_data["edition"],
                transformed_data["ISBN"],
                transformed_data["year"]
            )) 
        except Exception as e: 
            print(f"Error inserting record: {e}")
    
    pg_conn.commit()
    print("Migration completed successfully")

if __name__ == "__main__": 
    migrate_books()
    pg_cursor.close()
    pg_conn.close()
    client.close()