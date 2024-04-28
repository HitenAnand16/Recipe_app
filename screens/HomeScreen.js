import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/Categories";
import axios from "axios";
import Recipes from "../components/recipes";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchText, setSearchText] = useState(""); // Defined in the state

  useEffect(() => {
    getCaterories();
    getRecipes();
  }, []);

  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    // Filter categories based on search text
    const filteredCategories = categories.filter((category) =>
      category.strCategory.toLowerCase().includes(text.toLowerCase())
    );

    // Update the filtered categories in the state
    setCategories(filteredCategories);

    // If the search text is empty, reset the categories to the original list
    if (text === "") {
      getCaterories();
    }
  };

  const getCaterories = async () => {
    try {
      const response = await axios.get(
        "https://themealdb.com/api/json/v1/1/categories.php"
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const getRecipes = async (category = "Beef") => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log("error:", err.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        {/*avtar and bell icon */}
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require("../assets/images/avatar.png")}
            style={{ height: hp(5), width: hp(5.5) }}
          />
          <BellIcon size={hp(4)} color="gray" />
        </View>

        {/* greeting & punch line */}
        <View className="mx-4 space-y-2 mb-1">
          <Text style={{ fontSize: hp(2) }} className="text-neutral-600">
            Hello, Hiten!
          </Text>
          <View>
            <Text
              style={{ fontSize: hp(4.5), marginBottom: hp(-1) }}
              className="font-semibold text-neutral-600"
            >
              Make your own food,
            </Text>
          </View>
          <Text
            style={{ fontSize: hp(4.5) }}
            className="font-semibold text-neutral-600"
          >
            Stay at <Text className="text-amber-400">home</Text>
          </Text>
        </View>

        {/* search bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="Search any category"
            placeholderTextColor="gray"
            style={{
              fontSize: hp(1.7),
              flex: 1,
              paddingLeft: 3,
              marginBottom: 1,
            }}
            value={searchText}
            onChangeText={handleSearch}
          />

          <View className="bg-white rounded-full p-2.5">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* Display filtered or original categories based on search */}
        <View>
          {categories.length > 0 ? (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          ) : (
            <Categories
              categories={categories} // Use the original categories list here
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/*recipes*/}
        <View>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </View>
  );
}
