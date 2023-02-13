class User < ApplicationRecord
	has_many :userroles
	has_many :roles, through: :userroles
	validates :username, presence: true
	validates :password, presence: true
	validates :email, presence: true
end
