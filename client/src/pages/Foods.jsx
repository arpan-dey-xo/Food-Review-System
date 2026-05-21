import { useEffect, useState } from "react";

import API from "../services/api";

function Foods() {
  const [foods, setFoods] = useState([]);

  const [reviews, setReviews] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await API.get("/foods");

      setFoods(response.data);

      response.data.forEach((food) => {
        fetchReviews(food._id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async (foodId) => {
    try {
      const response = await API.get(`/reviews/${foodId}`);

      setReviews((prev) => ({
        ...prev,

        [foodId]: response.data.totalReviews,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const addFood = async (e) => {
    e.preventDefault();

    try {
      const foodData = new FormData();

      foodData.append("name", formData.name);

      foodData.append("description", formData.description);

      foodData.append("price", formData.price);

      foodData.append("image", formData.image);

      await API.post(
        "/foods/add",

        foodData,

        {
          headers: {
            Authorization: localStorage.getItem("token"),

            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Food Added");

      fetchFoods();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const addReview = async (foodId, review) => {
    try {
      await API.post(
        "/reviews/add",

        {
          foodId,
          review,
        },

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      alert("Review Added");

      fetchReviews(foodId);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const deleteFood = async (id) => {
    try {
      await API.delete(
        `/foods/delete/${id}`,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      alert("Food Deleted");

      fetchFoods();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Food Items 🍔</h1>

      {user?.role === "vendor" && (
        <form onSubmit={addFood} className="border p-6 rounded mb-10 space-y-4">
          <h2 className="text-2xl font-bold">Add Food</h2>

          <input
            type="text"
            name="name"
            placeholder="Food Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            Add Food
          </button>
        </form>
      )}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food._id} className="border p-4 rounded shadow">
            {food.image && (
              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                alt={food.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-xl font-bold">{food.name}</h2>

            <p className="mt-2">{food.description}</p>

            <p className="mt-2 font-semibold">₹ {food.price}</p>

            <p className="mt-2 text-sm text-gray-500">
              Vendor: {food.vendorId?.name}
            </p>

            <p className="mt-2 text-green-600 font-semibold">
              Reviews: {reviews[food._id] || 0}
            </p>

            {user?.role === "student" && (
              <div className="mt-4">
                <select
                  className="border p-2 w-full"
                  onChange={(e) => addReview(food._id, e.target.value)}
                >
                  <option value="">Select Review</option>

                  <option value="Excellent">Excellent</option>

                  <option value="Good">Good</option>

                  <option value="Average">Average</option>

                  <option value="Bad">Bad</option>
                </select>
              </div>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => deleteFood(food._id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              >
                Delete Food
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Foods;