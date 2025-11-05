// Category images mapping - using Unsplash URLs for now
// You can replace these with your own images later

export const CATEGORY_IMAGES: Record<string, string> = {
  "women clothing": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  "men's clothing": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
  "home essential": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  "kitten wave": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
  "cosmetics": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
  "kids clothing": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=300&fit=crop",
  "jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
  "handbags": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
  "beding": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  "home decoration": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  "men's shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  "ladies shoes": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
  "kids shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  "bathroom products": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  "Islamic accessories": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
  "men's watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  "Ladies watch's": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
  "Kids watch's": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  "perfumes": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
  "toys and stationery": "https://images.unsplash.com/photo-1553452118-621e1f860f43?w=400&h=300&fit=crop"
};

export const getCategoryImage = (category: string): string => {
  return CATEGORY_IMAGES[category.toLowerCase()] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop";
};

