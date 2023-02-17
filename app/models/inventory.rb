class Inventory < ApplicationRecord
	has_many :comments
	has_many :usercontentreactions
	has_many :reactions, through: :usercontentreactions
	validates :productname, presence: true
	validates :vendor, presence: true
end