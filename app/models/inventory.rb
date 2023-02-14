class Inventory < ApplicationRecord
	has_many :users
	has_many :inventoryreactions
	has_many :reactions, through: :inventoryreactions
	validates :productname, presence: true
	validates :vendor, presence: true
end