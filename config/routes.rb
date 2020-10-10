Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/adminpanel', as: 'rails_admin'

  post 'api/v1/users/search'

	namespace 'api' do
		namespace 'v1' do
			resources :inventories
		end
	end
end
