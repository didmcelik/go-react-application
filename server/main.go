package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type UserResponse struct {
	Status  int        `json:"status"`
	Message string     `json:"message"`
	Data    *fiber.Map `json:"data"`
}

const connectionString = "mongodb+srv://didemcelik:qwp!jB2iZrvkFQj@cluster0.ibtojgy.mongodb.net/?retryWrites=true&w=majority"
const dbName = "crud-app"
const colName = "users"

var collection *mongo.Collection

func init() {

	clientOption := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOption)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("MongoDB connection success")
	collection = client.Database(dbName).Collection(colName)
	fmt.Println("Collection instance is ready")

}
func deleteUser(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, _ := primitive.ObjectIDFromHex(idParam)
	filter := bson.M{"_id": id}

	deleteCount, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("user deleted", deleteCount)
	return c.Status(http.StatusOK).JSON(UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": "User successfully deleted!"}})

	// w.Header().Set("Content-Type", "application/x-www-form-urlencode")
	// w.Header().Set("Allow-Control-Allow-Methods", "POST")

	// params := mux.Vars(r)
	// id, _ := primitive.ObjectIDFromHex(params["id"])
	// fmt.Println("user delete id :", id)
	// filter := bson.M{"_id": id}
	// deleteCount, err := collection.DeleteOne(context.Background(), filter)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// fmt.Println("user deleted, delete count:", deleteCount)

}
func main() {
	fmt.Print("Hello world")

	app := fiber.New()

	//router := mux.NewRouter()
	app.Delete("/delete/:id", deleteUser)

	//router.HandleFunc("/delete/{id}", deleteUser).Methods("DELETE")

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	users := []User{}

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Post("/create", func(c *fiber.Ctx) error {

		user := &User{}
		if er := c.BodyParser(user); er != nil {
			return er
		}

		inserted, err := collection.InsertOne(context.Background(), user)
		if err != nil {

			log.Fatal(err)
		}

		fmt.Println("inserted", inserted.InsertedID)
		fmt.Println("inserted 1 user in db with id: ", inserted.InsertedID)
		user.ID = len(users) + 1

		users = append(users, *user)

		return c.JSON(user)
	})

	app.Put("/update/:id/:username", func(c *fiber.Ctx) error {

		idParam := c.Params("id")
		username := c.Params("username")

		fmt.Println("idParam", idParam)
		fmt.Println("username", username)
		user := &User{}
		id, _ := primitive.ObjectIDFromHex(idParam)

		filter := bson.M{"_id": id}
		update := bson.M{"$set": bson.M{"username": username}}

		err := collection.FindOneAndUpdate(context.Background(), filter, update, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&user)

		if err != nil {
			log.Fatal(err)
		}

		fmt.Println("modified data")

		// for i, t := range users {
		// 	if t.ID == idParam {
		// 		users[i].Username = username
		// 		user := users[i]
		// 		return c.JSON(user)

		// 	}
		// }

		return c.JSON(user)

		// id, err := c.ParamsInt("id")
		// username := c.Params("username")
		// if err != nil {
		// 	return c.Status(401).SendString("Invalid Id")
		// }
		// user := &User{}
		// for i, t := range users {
		// 	if t.ID == id {
		// 		users[i].Username = username
		// 		user := users[i]
		// 		return c.JSON(user)

		// 	}
		// }

		// return c.JSON(user)
	})

	// app.Delete("/delete/:id", func(c *fiber.Ctx) error {
	// 	idParam := c.Params("id")
	// 	id, _ := primitive.ObjectIDFromHex(idParam)
	// 	filter := bson.M{"_id": id}

	// 	deleteCount, err := collection.DeleteOne(context.Background(), filter)
	// 	if err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	user := &User{}
	// 	fmt.Println("user deleted", deleteCount)
	// 	return c.JSON(user)

	// 	// id, err := c.ParamsInt("id")

	// 	// if err != nil {
	// 	// 	return c.Status(401).SendString("Invalid Id")
	// 	// }
	// 	// user := &User{}
	// 	// for i, t := range users {
	// 	// 	if t.ID == id {

	// 	// 		user := users[i]
	// 	// 		users = append(users[:i], users[i+1:]...)
	// 	// 		return c.JSON(user)

	// 	// 	}
	// 	// }

	// 	// return c.JSON(user)
	// })

	app.Get("/get/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid Id")
		}
		user := &User{}
		for i, t := range users {
			if t.ID == id {
				user := users[i]
				return c.JSON(user)

			}
		}

		return c.JSON(user)
	})

	app.Get("/getAll", func(c *fiber.Ctx) error {

		return c.JSON(users)
	})

	log.Fatal(app.Listen(":4000"))
}
