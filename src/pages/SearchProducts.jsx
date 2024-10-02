import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Range } from "react-range";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import Products from "../components/products/Products";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import ShopProducts from "../components/products/ShopProducts";
import Pagination from "../components/Pagination";
import { price_range_product, query_products } from "../store/reducers/homeReducer";
import { useDispatch, useSelector } from "react-redux";
import RatingSelector from "../components/RatingSelector";
import { colourOptions, tagOptions } from "../assets/data";
import PageHeader from "./PageHeader";
import Skeleton from "../components/Skeleton";

const SearchProducts = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchValue = searchParams.get("value");
  const { products, totalProduct, latest_product, priceRange, parPage, loader } = useSelector(
    (state) => state.home
  );

  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [styles, setStyles] = useState("grid");
  const [filter, setFilter] = useState(true);
  const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
  const [rating, setRatingQ] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [sortByDate, setSortByDate] = useState("");
  const [InStock, setInStock] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    dispatch(price_range_product());
  }, []);
  useEffect(() => {
    setState({
      values: [priceRange.low, priceRange.high],
    });
  }, [priceRange]);

  // useEffect(() => {
  //   dispatch(
  //     query_products({
  //       low: state.values[0] || "",
  //       high: state.values[1] || "",
  //       category,
  //       rating,
  //       sortPrice,
  //       sortByDate,
  //       InStock,
  //       pageNumber,
  //       searchValue,
  //       tagValue,
  //       color,
  //     })
  //   );
  // }, [
  //   state.values[0],
  //   state.values[1],
  //   category,
  //   rating,
  //   pageNumber,
  //   sortPrice,
  //   sortByDate,
  //   InStock,
  //   searchValue,
  //   tagValue,
  //   color,
  // ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        query_products({
          low: state.values[0] || "",
          high: state.values[1] || "",
          category,
          rating,
          sortPrice,
          sortByDate,
          InStock,
          pageNumber,
          searchValue,
          tagValue,
          color,
        })
      );
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [
    state.values[0],
    state.values[1],
    category,
    rating,
    pageNumber,
    sortPrice,
    sortByDate,
    InStock,
    searchValue,
    tagValue,
    color,
  ]);

  const Reset = () => {
    setRatingQ("");
    setState({
      values: [priceRange.low, priceRange.high],
    });
    setInStock("");
    setPageNumber(1);
    setSortPrice("");
    setSortByDate("");
    setColor("");
    setTagValue("");
  };

  return (
    <div>
      <Headers />
      <PageHeader title="Search Products" category="search" />
      {/* <section className=" h-[120px] mt-6 bg-cover bg-no-repeat relative bg-left">
        <div className="absolute left-0 top-0 w-full h-full bg-white shadow">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-slate-700">
              <h2 className="text-3xl font-bold">Search Products</h2>
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to="/">Home</Link>
                <span className="pt-1">
                  <MdOutlineKeyboardArrowRight />
                </span>
                <span>Search</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="py-12 bg-slate-100 ">
        <div className="w-[85%] md:w-[90%%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
          <div className={`md:block hidden ${!filter ? "mb-6" : "mb-0"}`}>
            <button
              onClick={() => setFilter(!filter)}
              className="text-center w-full py-2 px-3 bg-orange-500 text-white"
            >
              Filter Product
            </button>
          </div>
          <div className="w-full flex flex-wrap">
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full md:pr-0 pr-8 mb-0 md:mb-5 ${
                filter ? "md:h-0 md:overflow-hidden md:mb-6" : "md:h-auto md:overflow-auto md:mb-0"
              }`}
            >
              <div className="py-2 flex flex-col gap-5 bg-white p-3 shadow">
                <h2 className="text-3xl font-bold mb-3 text-slate-600">Price</h2>
                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div {...props} className="w-full h-[6px] bg-slate-200 rounded-full cursor-default">
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div className="w-[15px] h-[15px] bg-orange-500 rounded-full" {...props} />
                  )}
                />
                <div>
                  <span className="text-red-500 font-bold text-lg">
                    ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                  </span>
                </div>
              </div>
              <div className="my-3 bg-white p-3 shadow flex flex-col gap-2 justify-center ">
                <span className="text-xl font-bold  text-slate-600">Availability</span>
                <span
                  onClick={() => setInStock("in-stock")}
                  className="font-medium  cursor-pointer text-slate-600"
                >
                  In Stock
                </span>
                <span
                  onClick={() => setInStock("out-of-stock")}
                  className="font-medium cursor-pointer  text-slate-600"
                >
                  Out Of Stock
                </span>
              </div>
              <div className="my-3 bg-white p-3 shadow flex flex-col gap-3 justify-center ">
                <span className="text-xl font-bold  text-slate-600">Choose Colors</span>
                <div className="flex gap-2 flex-wrap">
                  {colourOptions.map((item, i) => {
                    const value = item.value.substring(1);
                    return (
                      <span
                        key={i}
                        onClick={() => setColor(value == color ? "" : value)}
                        style={{ backgroundColor: item.value }}
                        className={`w-9 h-9 rounded-full cursor-pointer ${
                          color == value ? "border-4 border-slate-400 shadow-lg" : ""
                        }`}
                      ></span>
                    );
                  })}
                </div>
              </div>
              <div className="py-3 flex flex-col gap-4 bg-white shadow px-3">
                <h2 className="text-xl font-bold text-slate-600">Rating</h2>
                <div className="flex flex-col gap-2">
                  <RatingSelector rating={5} onClick={() => setRatingQ(5)} />
                  <RatingSelector rating={4} onClick={() => setRatingQ(4)} />
                  <RatingSelector rating={3} onClick={() => setRatingQ(3)} />
                  <RatingSelector rating={2} onClick={() => setRatingQ(2)} />
                  <RatingSelector rating={1} onClick={() => setRatingQ(1)} />
                </div>
              </div>
              <div className="p-2 flex flex-col gap-4 md:hidden bg-white shadow my-2">
                <h3 className="text-xl font-bold text-slate-600">Product Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((item, i) => (
                    <span
                      onClick={() => setTagValue(item.label)}
                      key={i}
                      className="bg-orange-400 hover:bg-orange-500 transition-all duration-300 cursor-pointer text-white font-medium px-2 py-1 text-sm"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-2 flex flex-col bg-white shadow my-2">
                <button onClick={Reset} className="bg-red-400 text-white px-5 py-2 font-medium">
                  Reset
                </button>
              </div>
              <div className="py-5 flex flex-col gap-4 md:hidden relative">
                <h4 className="absolute top-5 text-xl left-1 font-medium text-slate-600">Latest Products</h4>
                <Products title="Latest Products" products={latest_product} />
              </div>
            </div>
            <div className="w-9/12 md-lg:w-8/12 md:w-full">
              <div className="">
                <div className="py-4 bg-white p-3 shadow mb-8 px-3 rounded-md flex justify-between sm:flex-col sm:gap-2 items-start border">
                  <h2 className="text-lg font-medium text-slate-600">{totalProduct} Products</h2>
                  <div className="flex justify-center items-center gap-2">
                    <select
                      onChange={(e) => setSortByDate(e.target.value)}
                      className="p-1 border outline-0 text-slate-600 font-semibold"
                      name=""
                      id=""
                    >
                      <option value="">Sort By Date</option>
                      <option value="old-to-new">Old To New</option>
                      <option value="new-to-old">New TO Old</option>
                    </select>
                    <select
                      onChange={(e) => setSortPrice(e.target.value)}
                      className="p-1 border outline-0 text-slate-600 font-semibold"
                      name=""
                      id=""
                    >
                      <option value="">Sort By</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price</option>
                    </select>
                    <div className="flex justify-center items-start gap-4 md-lg:hidden">
                      <div
                        onClick={() => setStyles("grid")}
                        className={`p-2 ${
                          styles === "grid" && "bg-slate-300 shadow-md"
                        } text-slate-600 shadow hover:bg-slate-300 cursor-pointer rounded-sm`}
                      >
                        <BsFillGridFill />
                      </div>
                      <div
                        onClick={() => setStyles("list")}
                        className={`p-2 ${
                          styles === "list" && "bg-slate-300 shadow-md"
                        } text-slate-600 shadow hover:bg-slate-300 cursor-pointer rounded-sm`}
                      >
                        <FaThList />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pb-8">
                  {loader ? (
                    <div className="grid grid-cols-3 md-lg:grid-cols-2 sm:grid-cols-1 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton styles={"h-[260px] w-full rounded-md "} key={i} />
                      ))}
                    </div>
                  ) : (
                    <ShopProducts products={products} styles={styles} />
                  )}
                </div>
                <div>
                  {totalProduct > parPage && (
                    <Pagination
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      totalItem={totalProduct}
                      parPage={parPage}
                      showItem={Math.floor(totalProduct / parPage)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SearchProducts;
