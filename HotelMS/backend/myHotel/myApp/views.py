from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient

database = MongoClient("mongodb://localhost:27017/")

db = database.HotelDataBase
booking_db = db.bookingDB
customer_db = db.customer

from json import JSONDecodeError
from bson import ObjectId
import bcrypt
import traceback

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            
            print(email, password)
            if not email or not password:
                return JsonResponse({"message": "Email and password are required"}, status=400)

            customer = customer_db.find_one({"email": email})
            print(customer)

            if customer:
                stored_password = customer.get("password")
                if password != stored_password:
                    return JsonResponse({"password" : "password must be same!"})
                print(stored_password)

                return JsonResponse({
                    "message": f"Welcome {email}",
                    "id": str(customer["_id"]),
                    "success": True,
                }, status=200)
            else:
                return JsonResponse({"notMatch": "No user found with this email!"}, status=404)
        
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=400)
        except KeyError as e:
            return JsonResponse({"message": f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            print("Error occurred:", str(e))  # Log the full error
            traceback.print_exc()  # This will show the full traceback
            return JsonResponse({"message": "Internal server error"}, status=500)
        

@csrf_exempt
def sign_up(request):
    if request.method == "POST":
        try:
            # Log raw request body for debugging
            print(request.body)
            
            # Load the JSON data from the request body
            data = json.loads(request.body)
            print(data)  # Log parsed data
            
            email = data.get("email")
            password = data.get("password")
            cpass = data.get("cpassword")

            # Check if passwords match
            if password != cpass:
                return JsonResponse({"pass": "Passwords do not match!"})

            # Check if the email already exists in the database
            existing_customer = customer_db.find_one({"email": email})
            if existing_customer:
                return JsonResponse({"email": "Email already registered!"}, status=400)

            # Insert the new customer into the database
            result = customer_db.insert_one(data)
            print(result)

            return JsonResponse(
                {
                    "message": f"Welcome {email}",
                    "id": str(result.inserted_id),
                    "success": True,
                },
                status=200,
            )
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def customer_details(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("_id")
        user = customer_db.find_one({"id": id})
        if user:
            user["_id"] = str(user["_id"])
            return JsonResponse({"user": user})
        return JsonResponse({"message": "User not found"}, status=404)


@csrf_exempt
def add_booking(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)  # Log incoming data
            
            # Validate required fields
            required_fields = ["customerName", "roomType", "checkIn", "checkOut", "guests"]
            for field in required_fields:
                if field not in data:
                    return JsonResponse({"message": f"Missing field: {field}"}, status=400)

            # Insert the booking into the database
            result = booking_db.insert_one(data)
            print(f"Booking added with ID: {result.inserted_id}")

            return JsonResponse({
                "success": True,
                "message": "Booking added successfully!",
                "bookingId": str(result.inserted_id)
            }, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=400)
        except Exception as e:
            print("Error occurred:", str(e))
            traceback.print_exc()
            return JsonResponse({"message": "Internal server error"}, status=500)


def display_bookings(request):
    if request.method == "GET":
        try:
            # Fetch all bookings from the booking database
            bookings = list(booking_db.find({}))

            # Convert ObjectId to string for JSON serialization
            for booking in bookings:
                booking["_id"] = str(booking["_id"])

            return JsonResponse({"success": True, "bookings": bookings}, status=200)
        except Exception as e:
            print("Error occurred:", str(e))  # Log the error
            return JsonResponse({"success": False, "message": "An error occurred while fetching bookings."}, status=500)