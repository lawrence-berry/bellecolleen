require 'rack'

# Create a static file server
app = Rack::Static.new(nil,
                       root: 'public',
                       urls: [''],
                       index: 'index.html')

run app
