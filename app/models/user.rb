class User < ApplicationRecord
	has_many :userroles
	has_many :roles, through: :userroles
	has_many :usercontentreactions
	has_many :inventories, through: :usercontentreactions
	has_many :reactions, through: :usercontentreactions
	has_many :comments
	validates :username, presence: true
	validates :password, presence: true
	validates :email, presence: true
end
