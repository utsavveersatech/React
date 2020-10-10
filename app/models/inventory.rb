class Inventory < ApplicationRecord
	has_many :users
	validates :productid, presence: true
	validates :productname, presence: true
	validates :vendor, presence: true
	validates :mrp, presence: true
	validates :batchnum, presence: true
	validates :batchdate, presence: true
	validates :quantity, presence: true
	validates :status, presence: true
	validates :modifiedby, presence: true
	validates :lastoperation, presence: true
end