class Role < ApplicationRecord
	has_many :userroles
	validates :name, presence: true
end
