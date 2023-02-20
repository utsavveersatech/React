class AddingPolymorphicAssocicationUsercintentreactions < ActiveRecord::Migration[6.1]
  def change
    add_column :usercontentreactions, :parent_element, :string
    rename_column :usercontentreactions, :inventory_id, :parent_element_id
  end
end
