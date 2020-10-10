class Userrole < ApplicationRecord
	belongs_to :role
	belongs_to :user
	validates :userid, presence: true
	validates :roleid, presence: true
end
