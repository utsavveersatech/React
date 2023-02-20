class Usercontentreaction < ApplicationRecord
    belongs_to :content, polymorphic: true
    belongs_to :user
    belongs_to :reaction
end