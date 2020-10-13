class Inventory < ApplicationRecord
	has_many :users
	validates :productname, presence: true
	validates :vendor, presence: true
end