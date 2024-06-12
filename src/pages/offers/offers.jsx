import React, { useEffect, useState } from "react";

// mui components
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Select,
    Chip,
    OutlinedInput,
  } from "@mui/material";
// firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// firebase service
import { db } from "../../firebaseConfig";

const Offers = () => {
  // local states
  const [uploading, setUploading] = useState(false);
  const [foodImgUploading, setFoodImgUploading] = useState(false);
  const [foodList, setFoodList] = useState([]);
  const [foods, setFoods] = useState([]);
  const [foodDetails, setFoodDetails] = useState({
    dishName: "",
    price: "",
    imgSrc: "",
    type: "",
    offer: "",
    priceAfterOffer: "",
  });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  // variables

  // -------------------------------- USE EFFECTS --------------------------------
  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "foodList");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setFoods(ordersList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "offers");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setFoodList(ordersList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    if (foodDetails.type === "combo" && selectedFoods.length > 0) {
      const totalComboPrice = selectedFoods.reduce((total, foodName) => {
        const food = foods.find((f) => f.dishName === foodName);
        return total + (food ? parseFloat(food.price) : 0);
      }, 0);
      setFoodDetails((prev) => ({ ...prev, price: totalComboPrice.toFixed(2) }));
    }
  }, [selectedFoods]);

  // -------------------------------- COMPONENT STYLES --------------------------------

  const categoriesStyle = {
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    minHeight: 500,
  };

  const textInputStyle = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "initial",
        boxShadow: "none",
      },
    },
  };

  const foodGridStyles = {
    minHeight: { xs: 60, md: 50 },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    borderRadius: 2,
    padding: 2,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    with: "100%",
    backgroundColor: "#ffffff",
    height: 500,
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  // food details input change
  const handleFoodInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dishName") {
      const selectedFood = foods.find((food) => food.dishName === value);
      console.log(selectedFood)
      if (selectedFood) {
        setFoodDetails({
          ...foodDetails,
          [name]: value,
          price: selectedFood.price,
          img: selectedFood.img,
        });
      } else {
        setFoodDetails({ ...foodDetails, [name]: value, price: "", imgSrc: "" });
      }
    } else {
      setFoodDetails({ ...foodDetails, [name]: value });
    }
  };

  // upload image file for the food item
  const handleFoodFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodImgUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `foodList/${file.name}`);
      await uploadBytes(storageRef, file);
      const imgSrc = await getDownloadURL(storageRef);
      setFoodDetails((prev) => ({ ...prev, imgSrc }));
      setFoodImgUploading(false);
    }
  };

  // adding food item under selected category
  const handleAddFoodItem = async () => {
    if (foodDetails.dishName && foodDetails.price) {
      setUploading(true);
      try {
        const priceAfterOffer = calculateAfterOfferPrice();
        await addDoc(collection(db, "offers"), {
          ...foodDetails,
          priceAfterOffer,
        });
        setFoodDetails({
          dishName: "",
          price: "",
          imgSrc: "",
          type: "",
          offer: "",
          priceAfterOffer: "",
        });
        setSelectedFoods([]);
      } catch (e) {
        console.error("Error adding food item: ", e);
      } finally {
        setUploading(false);
      }
    }
  };

  
  const handleDeleteFood = async () => {
    if (selectedCard) {
      try {
        await deleteDoc(doc(db, "foodList", selectedCard));
        setSelectedCard(null);
      } catch (e) {
        console.error("Error deleting food item: ", e);
      }
    }
  };


const handleFoodSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFoods = foods.filter((food) =>
    food.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleComboFoodChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFoods(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const calculateAfterOfferPrice = () => {
    if (foodDetails.offer && foodDetails.price) {
      const offerPercentage = parseFloat(foodDetails.offer);
      const originalPrice = parseFloat(foodDetails.price);
      return (originalPrice - (originalPrice * offerPercentage) / 100).toFixed(2);
    }
    return "";
  };

  // -------------------------------- RENDER UI --------------------------------

  const renderAddFoodFields = () => {
    return (
      <Box sx={categoriesStyle}>
        <Typography gutterBottom sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}>
          Add Offers
        </Typography>
        <Divider sx={{ backgroundColor: "#00000090", width: "100%", my: 1, mb: 2 }} />
        <TextField
          label="Offer Type"
          name="type"
          value={foodDetails.type}
          onChange={handleFoodInputChange}
          select
          fullWidth
          sx={{ mb: 2, ...textInputStyle }}
        >
          <MenuItem value="special">Special</MenuItem>
          <MenuItem value="combo">Combo</MenuItem>
        </TextField>
        <TextField
          label="Offer"
          name="offer"
          value={foodDetails.offer}
          onChange={handleFoodInputChange}
          fullWidth
          sx={{ mb: 2, ...textInputStyle }}
        />
        {foodDetails.type === "combo" ? (
          <Select
            multiple
            displayEmpty
            value={selectedFoods}
            onChange={handleComboFoodChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Food Name</em>;
              }
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              );
            }}
            fullWidth
            sx={{ mb: 2, ...textInputStyle }}
          >
            {filteredFoods.map((food) => (
              <MenuItem key={food.id} value={food.dishName}>
                {food.dishName}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            label="Food Name"
            name="dishName"
            value={foodDetails.dishName}
            onChange={handleFoodInputChange}
            fullWidth
            select
            sx={{ mb: 2, ...textInputStyle }}
          >
            {filteredFoods.map((food) => (
              <MenuItem key={food.id} value={food.dishName}>
                {food.dishName}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Price"
          name="price"
          value={foodDetails.price}
          onChange={handleFoodInputChange}
          fullWidth
          disabled={foodDetails.type === "combo"}
          sx={{ mb: 2, ...textInputStyle }}
        />
          <TextField
            label="After Offer Price"
            name="afterOfferPrice"
            value={calculateAfterOfferPrice()}
            fullWidth
            disabled
            sx={{ mb: 2, ...textInputStyle }}
          />
        <Box sx={{ my: 2, width: 200, height: 200 }}>
          {foodImgUploading ? (
            <Box
              sx={{
                width: 200,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: 10,
                borderRadius: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            foodDetails.img && (
              <img
                src={foodDetails.img}
                width={"100%"}
                height={"100%"}
                style={{ borderRadius: 10 }}
                alt="img"
              />
            )
          )}
        </Box>
        {console.log(foodDetails)}
        <Button
          variant="outlined"
          component="label"
          sx={{
            justifyContent: "space-between",
            display: "flex",
            height: 50,
            background: "transparent",
            marginBottom: "10px",
          }}
        >
          Upload File
          <CloudUploadIcon />
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            hidden
            onChange={handleFoodFileChange}
          />
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ height: 40, width: "40%" }}
            onClick={handleDeleteFood}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddFoodItem}
            sx={{ height: 40, width: "45%", display: "flex", alignSelf: "flex-end" }}
          >
            Add
          </Button>
        </Box>
      </Box>
    );
  };
  const specialOfferList = () => {
    const specialOffers = foodList.filter((food) => food.type === "special");

    return (
      <Paper
        elevation={6}
        sx={{
          ...foodGridStyles,
        }}
      >
        <Box
          sx={{
            flexDirection: "row",
            justifyItems: "space-between",
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 20,
              color: "#000",
            }}
          >
            Special Offers
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#00000090", width: "100%", mb: 2 }} />
        {specialOffers.length > 0 ? (
          specialOffers.map((food, index) => (
            <Box
              key={food.id}
              sx={{
                display: "flex",
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                marginBottom: 2,
                alignItems: "center",
                backgroundColor: index % 2 === 0 ? "#3c3c4e" : "#d7d7d78a",
                width: "100%",
                justifyContent: "space-between",
                borderRadius: "10px",
                border: "2px solid #3c3c4e ",
              }}
            >
              <Box sx={{ flex: 1, padding: "0 10px" }}>
                <Typography
                  gutterBottom
                  sx={{
                    color: index % 2 === 0 ? "#fff" : "#000",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {food.dishName}
                </Typography>
                <Typography
                  gutterBottom
                  sx={{
                    color: index % 2 === 0 ? "#fff" : "#000",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecorationLine: "line-through",
                  }}
                >
                  Price : {food.price}
                </Typography>
                <Typography
                  gutterBottom
                  sx={{ color: "#00FF00", fontSize: 12 }}
                >
                  {`offer ${food.offer}%`}
                </Typography>
                <Typography
                  gutterBottom
                  sx={{ color: "#00FF00", fontSize: 16 }}
                >
                  {food.priceAfterOffer}
                </Typography>
              </Box>
              <img
                src={food.img}
                width={100}
                height={100}
                style={{ borderRadius: 5 }}
                alt="Food"
              />
            </Box>
          ))
        ) : (
          <Typography
            gutterBottom
            sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
          >
            No Special Offers added yet.
          </Typography>
        )}
      </Paper>
    );
  };

  const comboOfferList = () => {
    return (
      <Paper
        elevation={6}
        sx={{
          ...foodGridStyles,
        }}
      >
        <Box
          sx={{
            flexDirection: "row",
            justifyItems: "space-between",
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 20,
              color: "#000",
            }}
          >
            Combo Offers
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#00000090", width: "100%", mb: 2 }} />
        <Typography
          gutterBottom
          sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
        >
          No Foods added in list
        </Typography>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
      }}
    >
      {/* --------------------- CATEGORIES BOX --------------------- */}
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", mt: 4 }}>
        Offers
      </Typography>

      {/* --------------------- CATEGORIES BOX --------------------- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          width: "100%",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
          {renderAddFoodFields()}
        </Box>
        <Box sx={{ width: { xs: "100%", md: "35%" } }}>
          {specialOfferList()}
        </Box>
        <Box sx={{ width: { xs: "100%", md: "35%" } }}>{comboOfferList()}</Box>
      </Box>
    </Box>
  );
};

export default Offers;
