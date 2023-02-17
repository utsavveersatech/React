class Reaction < ApplicationRecord
	has_many :usercontentreactions
	has_many :users, through: :usercontentreactions
	has_many :inventories, through: :usercontentreactions
end