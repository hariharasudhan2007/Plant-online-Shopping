import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Star, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  ShieldAlert, 
  ShoppingBag, 
  Eye, 
  Plus, 
  ArrowUpDown,
  Leaf,
  SlidersHorizontal,
  Check,
  Package
} from "lucide-react";
import { PlantProduct, PlantCategory, CareDifficulty, LightRequirement, Project, AppView } from "../types";
import { PLANT_CATALOG } from "../data/plants";

interface ShopViewProps {
  catalog?: PlantProduct[];
  plants?: PlantProduct[];
  onSelectPlant: (plant: PlantProduct) => void;
  onAddToCart: (plant: PlantProduct, quantity?: number) => void;
  projects?: Project[];
  onAssignToProject?: (plant: PlantProduct, projectId: string) => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
  onNavigate?: (view: AppView) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  catalog,
  plants,
  onSelectPlant,
  onAddToCart,
  projects = [],
  onAssignToProject,
  onOpenAiWithPrompt,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [lightFilter, setLightFilter] = useState<string>("all");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const plantList = catalog || plants || PLANT_CATALOG;

  const categories: { id: PlantCategory; label: string }[] = [
    { id: "all", label: "All Curations" },
    { id: "indoor", label: "Indoor Foliage" },
    { id: "trees", label: "🌳 Trees & Bonsai" },
    { id: "outdoor", label: "🌿 Outdoor Living" },
    { id: "pots", label: "🪴 Pots & Planters" },
    { id: "care-supplies", label: "🌱 Soil, Coco & Nutrients" },
    { id: "pet-friendly", label: "🐾 Pet-Friendly" },
    { id: "low-light", label: "Low Light Stars" },
    { id: "rare", label: "✨ Rare & Variegated" },
    { id: "succulents", label: "Succulents & Cacti" },
  ];

  const filteredPlants = useMemo(() => {
    return plantList.filter((plant) => {
      // Category filter with smart tag matching for trees, outdoor, pots & supplies
      if (selectedCategory !== "all") {
        if (selectedCategory === "trees") {
          const isTreeCategory = plant.category === "trees";
          const isTreeTag = plant.tags.some((t) => /tree|bonsai|palm|canopy/i.test(t));
          if (!isTreeCategory && !isTreeTag) return false;
        } else if (selectedCategory === "outdoor") {
          const isOutdoorCategory = plant.category === "outdoor";
          const isOutdoorTag = plant.tags.some((t) => /outdoor|patio|terrace|shrub|garden/i.test(t));
          if (!isOutdoorCategory && !isOutdoorTag) return false;
        } else if (selectedCategory === "pots") {
          const isPotCategory = plant.category === "pots";
          const isPotTag = plant.tags.some((t) => /pot|planter|saucer|ceramic|terracotta|brass|stand|macrame/i.test(t));
          if (!isPotCategory && !isPotTag) return false;
        } else if (selectedCategory === "care-supplies") {
          const isSupplyCategory = plant.category === "care-supplies";
          const isSupplyTag = plant.tags.some((t) => /cocopeat|cocobit|coir|fertilizer|food|nutrient|kelp|pumice|shear|soil|substrate|perlite/i.test(t));
          if (!isSupplyCategory && !isSupplyTag) return false;
        } else if (selectedCategory === "indoor") {
          const isIndoorCategory = plant.category === "indoor";
          const isIndoorTag = plant.tags.some((t) => /indoor|houseplant|aroid|foliage/i.test(t));
          if (!isIndoorCategory && !isIndoorTag && plant.category !== "indoor") return false;
        } else if (plant.category !== selectedCategory) {
          return false;
        }
      }
      // Pet friendly filter
      if (petFriendlyOnly && !plant.petFriendly) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== "all" && plant.careDifficulty !== difficultyFilter) {
        return false;
      }
      // Light filter
      if (lightFilter !== "all" && plant.light !== lightFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = plant.name.toLowerCase().includes(query);
        const matchBotanical = plant.botanicalName.toLowerCase().includes(query);
        const matchTags = plant.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchBotanical && !matchTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });
  }, [plantList, selectedCategory, petFriendlyOnly, difficultyFilter, lightFilter, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, plant: PlantProduct) => {
    e.stopPropagation();
    onAddToCart(plant, 1);
    setJustAddedId(plant.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Botanical Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] text-white shadow-lg">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d8f3dc_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-4xl px-6 py-10 sm:px-10 sm:py-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#d8f3dc] text-xs font-semibold tracking-wide uppercase border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> Direct Nursery Greenhouse Curations
          </div>
          
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            Bring Living Nature Into Your Living Space.
          </h1>
          
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
            Hand-selected tropical houseplants, architectural indoor and outdoor trees, bonsai specimens, and sustainable care supplies. Each plant includes custom care schedules synced to your task manager.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onOpenAiWithPrompt?.("Recommend the best pots, coco coir substrate, and fertilizers for my plants.")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#1b4332] font-semibold text-xs sm:text-sm hover:bg-[#d8f3dc] transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#2d6a4f]" /> Ask Flora for Advice
            </button>
            <button
              onClick={() => setSelectedCategory("trees")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
            >
              🌳 Trees & Bonsai
            </button>
            <button
              onClick={() => setSelectedCategory("pots")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
            >
              🪴 Pots & Planters
            </button>
            <button
              onClick={() => setSelectedCategory("care-supplies")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
            >
              🌱 Coco, Soil & Nutrients
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#1b4332] text-white shadow-xs scale-102"
                  : "bg-white text-[#405648] hover:bg-[#eef4f0] border border-[#e2ece5]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ece5] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by plant name, botanical classification, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#f8faf8] border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f] text-[#1b4332]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-[#f8faf8] border border-[#cbd7cf] text-[#1b4332] font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Master / Rare</option>
            </select>

            {/* Light Filter */}
            <select
              value={lightFilter}
              onChange={(e) => setLightFilter(e.target.value)}
              className="bg-[#f8faf8] border border-[#cbd7cf] text-[#1b4332] font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
            >
              <option value="all">All Light Levels</option>
              <option value="Low Light">Low Light</option>
              <option value="Medium Indirect">Medium Indirect</option>
              <option value="Bright Indirect">Bright Indirect</option>
              <option value="Direct Sun">Direct Sun</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f8faf8] border border-[#cbd7cf] text-[#1b4332] font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Pet Friendly Toggle */}
            <button
              onClick={() => setPetFriendlyOnly(!petFriendlyOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium border transition-colors cursor-pointer ${
                petFriendlyOnly
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold"
                  : "bg-[#f8faf8] text-[#405648] border-[#cbd7cf] hover:bg-gray-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pet-Friendly Only</span>
            </button>
          </div>
        </div>

        {/* Results count & active tags */}
        <div className="flex items-center justify-between text-xs text-[#52796f] pt-1">
          <span>
            Showing <strong>{filteredPlants.length}</strong> botanical specimens
          </span>
          {(difficultyFilter !== "all" || lightFilter !== "all" || petFriendlyOnly || searchQuery) && (
            <button
              onClick={() => {
                setDifficultyFilter("all");
                setLightFilter("all");
                setPetFriendlyOnly(false);
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-[#2d6a4f] hover:underline font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Plant Products Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2ece5] p-8 space-y-3">
          <Leaf className="w-12 h-12 text-[#95d5b2] mx-auto" />
          <h3 className="font-display font-bold text-xl text-[#1b4332]">No plants matched your criteria</h3>
          <p className="text-xs text-[#52796f] max-w-sm mx-auto">
            Try adjusting your search keywords, difficulty, or light levels to explore other nursery specimens.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setDifficultyFilter("all");
              setLightFilter("all");
              setPetFriendlyOnly(false);
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#1b4332] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => onSelectPlant(plant)}
              className="group bg-white rounded-2xl border border-[#e2ece5] overflow-hidden hover:shadow-lg hover:border-[#b7d0c0] transition-all flex flex-col justify-between cursor-pointer"
              id={`plant-card-${plant.id}`}
            >
              {/* Plant Image & Badges */}
              <div className="relative aspect-4/3 bg-[#f1f6f3] overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Difficulty & Pet Safe tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-white/90 backdrop-blur-xs text-[#1b4332] shadow-xs">
                    {plant.careDifficulty}
                  </span>
                  {plant.petFriendly && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-100 text-emerald-800 shadow-xs">
                      <ShieldCheck className="w-3 h-3" /> Pet Safe
                    </span>
                  )}
                </div>

                {/* Quick View trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlant(plant);
                  }}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 text-gray-700 hover:bg-white hover:text-[#1b4332] shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="View Care Specs"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Plant Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-mono text-[10px] uppercase text-[#52796f] tracking-wider">
                      {plant.potSize}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{plant.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors leading-snug">
                    {plant.name}
                  </h3>
                  <p className="italic text-xs text-[#52796f] font-serif mb-3 line-clamp-1">
                    {plant.botanicalName}
                  </p>

                  {/* Micro Specs */}
                  {plant.category === "pots" || plant.category === "care-supplies" ? (
                    <div className="flex items-center gap-2.5 text-[11px] text-gray-600 mb-3 bg-[#f8faf8] p-2 rounded-lg border border-[#e2ece5]">
                      <span className="flex items-center gap-1 truncate text-[#1b4332] font-medium" title={plant.potSize}>
                        <Package className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{plant.potSize}</span>
                      </span>
                      <span className="border-l border-gray-200 pl-2 flex items-center gap-1 truncate text-[#2d6a4f]" title={plant.tags[0] || "Botanical Supply"}>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{plant.tags[0] || "Supply"}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-[11px] text-gray-600 mb-3 bg-[#f8faf8] p-2 rounded-lg border border-[#e2ece5]">
                      <span className="flex items-center gap-1 truncate" title={plant.light}>
                        <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{plant.light}</span>
                      </span>
                      <span className="border-l border-gray-200 pl-2 flex items-center gap-1 truncate" title={plant.water}>
                        <Droplet className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{plant.water}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Price & Quick Add Button */}
                <div className="pt-3 border-t border-[#e2ece5] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-[#1b4332]">
                        ${plant.price.toFixed(2)}
                      </span>
                      {plant.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${plant.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      In Stock ({plant.stock})
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, plant)}
                    id={`quick-add-${plant.id}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      justAddedId === plant.id
                        ? "bg-emerald-700 text-white"
                        : "bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-xs"
                    }`}
                  >
                    {justAddedId === plant.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
