class Inventoryreaction < ApplicationRecord
    belongs_to :inventory
    belongs_to :reaction
end