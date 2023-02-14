Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/adminpanel', as: 'rails_admin'

  post 'api/v1/users/search'

	namespace 'api' do
		namespace 'v1' do
			resources :inventories
			resources :users, only: [:show, :index]
		end
	end
end
