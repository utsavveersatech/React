class InventorySerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :updated_at
end
