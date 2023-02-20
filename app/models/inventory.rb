class Inventory < ApplicationRecord
	has_many :usercontentreactions, as: :content 
	has_many :comments
	validates :productname, presence: true
	validates :vendor, presence: true
end