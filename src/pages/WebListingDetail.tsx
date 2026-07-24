import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Check, ChevronRight, ChevronDown, ChevronLeft, ShieldCheck, MapPin } from 'lucide-react';

export default function WebListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#222222] font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs text-[#595959] mb-4 space-x-1">
          <Link to="/" className="hover:underline">Homepage</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clothing" className="hover:underline">Clothing</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN - Images & Reviews */}
          <div className="w-full lg:w-[65%]">
            {/* Image Section */}
            <div className="flex gap-4 mb-8">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-16 h-16 bg-zinc-200 rounded-md cursor-pointer hover:ring-2 hover:ring-black"></div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="relative w-full aspect-square md:aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden group">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-zinc-50 hidden group-hover:flex">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-zinc-50 hidden group-hover:flex">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-zinc-50">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Reviews for this item</h2>
              
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">4.9</span>
                  <div>
                    <div className="flex text-yellow-500 mb-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <span className="text-sm text-zinc-500 underline cursor-pointer">(704 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                {['Suggested', 'Quality (315)', 'Seller service (243)', 'Shipping (171)'].map((filter, i) => (
                  <button key={i} className="px-4 py-2 rounded-full border border-zinc-300 text-sm font-medium hover:bg-zinc-100 whitespace-nowrap">
                    {filter}
                  </button>
                ))}
              </div>

              {/* Sample Review */}
              <div className="border-b border-zinc-200 py-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="w-6 h-6 rounded-full bg-zinc-300"></span>
                    <span className="font-medium text-black">Verday</span>
                    <span>Jul 24, 2026</span>
                  </div>
                </div>
                <p className="text-[#222222] mt-2">The shirt was exactly what I wanted as a gift. Perfect gift for pet parents.</p>
              </div>
              <div className="border-b border-zinc-200 py-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="w-6 h-6 rounded-full bg-zinc-300"></span>
                    <span className="font-medium text-black">Kristy</span>
                    <span>Jul 23, 2026</span>
                  </div>
                </div>
                <p className="text-[#222222] mt-2">Great shirt and great design. Couldn't ask for anything better.</p>
              </div>
            </div>

            {/* Photos from reviews */}
            <div className="mt-12">
              <h2 className="text-lg font-bold mb-4">Photos from reviews</h2>
              <div className="flex gap-4 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-48 h-48 rounded-lg bg-zinc-200 shrink-0"></div>
                ))}
              </div>
            </div>

            {/* Shop Profile Card */}
            <div className="mt-12 p-6 border border-zinc-200 rounded-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-200"></div>
                  <div>
                    <h3 className="text-xl font-bold">UpTopNorth</h3>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-zinc-600">San Jose, California</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1 font-medium">
                      <Star className="w-4 h-4 fill-black" />
                      <span>4.9 (23.9k)</span>
                      <span className="text-zinc-300">|</span>
                      <span>139.7k sales</span>
                      <span className="text-zinc-300">|</span>
                      <span>6 years on Etsy</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-zinc-300 rounded-full font-bold hover:bg-zinc-100 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Follow shop
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Details & Cart */}
          <div className="w-full lg:w-[35%] lg:pl-4">
            <div className="text-red-600 font-medium text-sm mb-2">
              In demand. 33 people bought this in the last 24 hours.
            </div>
            
            <div className="mb-2">
              <span className="text-3xl font-bold text-green-700">Now $13.99+</span>
              <span className="text-zinc-500 line-through ml-2">$27.98+</span>
            </div>
            
            <div className="text-green-700 text-sm font-medium mb-4">
              50% off <span className="text-zinc-500 ml-1">Sale ends in 17:59:34</span>
            </div>

            <h1 className="text-[22px] leading-tight font-light mb-2">
              Comfort Colors® Custom Girlfriend Shirt, Personalized Bootleg Girlfriend T Shirt, Bootleg Boyfriend Tee
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="font-bold">UpTopNorth</span>
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-700 shrink-0" />
                <p><span className="font-bold">Arrives soon!</span> Get it by <span className="font-bold underline">Jul 30-Aug 6</span> if you order today</p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-blue-600 shrink-0" />
                <p>Returns & exchanges accepted</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2">Color + Size <span className="text-red-600">*</span></label>
                <div className="relative">
                  <select className="w-full appearance-none border border-zinc-300 rounded-lg p-3 pr-10 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-black">
                    <option>Select an option</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Design Color Number <span className="text-red-600">*</span></label>
                <div className="relative">
                  <select className="w-full appearance-none border border-zinc-300 rounded-lg p-3 pr-10 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-black">
                    <option>Select an option</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Quantity</label>
                <div className="relative">
                  <select className="w-full appearance-none border border-zinc-300 rounded-lg p-3 pr-10 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-black">
                    <option>1</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button className="w-full py-3.5 rounded-full border border-black font-bold text-base hover:bg-zinc-100 flex items-center justify-center gap-2">
                Buy it now | <span className="bg-zinc-200 px-2 py-0.5 rounded text-xs">...1913</span>
              </button>
              <button className="w-full py-3.5 rounded-full bg-black text-white font-bold text-base hover:bg-zinc-800">
                Add to cart
              </button>
              <button className="w-full py-3 font-bold text-base flex items-center justify-center gap-2 hover:bg-zinc-100 rounded-full">
                <Heart className="w-5 h-5" /> Add to collection
              </button>
            </div>

            {/* Star Seller Badge */}
            <div className="bg-purple-50 p-4 rounded-xl flex gap-3 mb-8">
              <Star className="w-6 h-6 text-purple-600 shrink-0 fill-current" />
              <p className="text-sm">
                <span className="font-bold text-purple-800">Star Seller.</span> This seller consistently earned 5-star reviews, shipped on time, and replied quickly to any messages they received.
              </p>
            </div>

            {/* Item Details Accordion */}
            <div className="border-t border-zinc-200">
              <button className="w-full py-4 flex items-center justify-between font-bold text-lg text-left">
                Item details
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="pb-4">
                <h4 className="font-bold mb-2">Highlights</h4>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex gap-2"><span className="shrink-0">✨</span> Designed by <span className="font-bold">UpTopNorth</span></li>
                  <li className="flex gap-2"><span className="shrink-0">📦</span> Materials: comfort colors, fast shipping</li>
                </ul>
                <p className="text-sm text-[#222222] leading-relaxed">
                  Show off your favorite person with this premium Comfort Colors® Custom Girlfriend Shirt. A vintage-inspired personalized bootleg girlfriend t shirt or retro bootleg boyfriend tee that makes the ultimate custom gift.
                </p>
              </div>
            </div>

            {/* Shipping Accordion */}
            <div className="border-t border-b border-zinc-200">
              <button className="w-full py-4 flex items-center justify-between font-bold text-lg text-left">
                Shipping and return policies
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="pb-4 space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="font-bold shrink-0">📅</span>
                  <div>
                    <p>Order today to get by <span className="font-bold underline">Jul 30-Aug 6</span></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold shrink-0">📦</span>
                  <div>
                    <p className="font-bold underline">Returns & exchanges accepted</p>
                    <p className="text-zinc-600">within 7 days</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold shrink-0">🚚</span>
                  <div>
                    <p>Cost to ship: <span className="font-bold">$5.99</span></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 shrink-0" />
                  <div>
                    <p>Ships from: <span className="font-bold">San Jose, CA</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="w-full aspect-square bg-zinc-200 rounded-lg mb-2 relative">
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-sm truncate">CUSTOM Girlfriend Shirt, Boyfri...</h3>
                <p className="font-bold text-green-700 mt-1">$8.99 <span className="text-xs text-zinc-500 line-through font-normal">$12.84</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
