class Reaction < ApplicationRecord
    has_many :inventoryreactions
    has_many :inventories, through: :inventoryreactions
end