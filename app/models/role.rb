class Role < ApplicationRecord
	has_many :userroles
	has_many :users, through: :userroles
	validates :name, presence: true
end
