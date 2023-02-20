class Comment < ApplicationRecord
    has_many :usercontentreactions, as: :content 
    belongs_to :user
    belongs_to :inventory
    validates :comment, presence: true
	validates :user_id, presence: true
    validates :inventory_id, presence: true
end