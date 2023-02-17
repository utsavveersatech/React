class Usercontentreaction < ApplicationRecord
    belongs_to :user
    belongs_to :inventory
    belongs_to :reaction
end