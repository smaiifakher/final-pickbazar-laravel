<?php

namespace Marvel\Http\Controllers;

use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Marvel\Database\Models\StoreNotice;
use Marvel\Database\Repositories\StoreNoticeReadRepository;
use Marvel\Database\Repositories\StoreNoticeRepository;
use Marvel\Enums\StoreNoticeType;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\StoreNoticeRequest;
use Marvel\Http\Requests\StoreNoticeUpdateRequest;
use Prettus\Validator\Exceptions\ValidatorException;

class StoreNoticeController extends CoreController
{
    public $repository;
    private $repositoryPivot;

    public function __construct(StoreNoticeRepository $repository, StoreNoticeReadRepository $repositoryPivot)
    {
        $this->repository = $repository;
        $this->repositoryPivot = $repositoryPivot;
    }


    /**
     * @param Request $request
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function index(Request $request)
    {
        if (!$request->user() && !$request['shop_id']) {
            return response(
                [
                    'errors'  => 'shop_id is missing',
                    'message' => NOT_AUTHORIZED
                ],
                401
            );
        }
        $limit = $request->limit ? $request->limit : 15;
        return $this->fetchStoreNotices($request)->paginate($limit);
    }

    /**
     * @param Request $request
     * @return StoreNoticeRepository
     * @throws MarvelException
     */
    public function fetchStoreNotices(Request $request)
    {
        return $this->repository->fetchStoreNotices($request);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreNoticeRequest $request
     * @return LengthAwarePaginator|Collection|mixed
     * @throws ValidatorException
     */
    public function store(StoreNoticeRequest $request)
    {
        return $this->repository->saveStoreNotice($request);
    }

    /**
     * @param Request $request
     * @return array|array[]
     */
    public function getStoreNoticeType(Request $request)
    {
        return $this->repository->fetchStoreNoticeType($request);
    }

    /**
     * This method will generate User list or Shop list based on requested user permission
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     * @throws MarvelException
     */
    public function getUsersToNotify(Request $request)
    {
        $typeArr = array(StoreNoticeType::ALL_SHOP, StoreNoticeType::ALL_VENDOR);
        if (in_array($request->type, $typeArr)) {
            throw new MarvelException(ACTION_NOT_VALID);
        }
        return $this->repository->fetchUserToSendNotification($request);
    }

    /**
     * Display the specified resource.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @throws MarvelException
     */
    public function show(Request $request, $id)
    {
        try {
            return $this->repository->findOrFail($id);
        } catch (Exception $e) {
            return response(['message' =>NOT_FOUND], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param StoreNoticeUpdateRequest $request
     * @param $id
     * @return StoreNotice
     * @throws MarvelException
     */
    public function update(StoreNoticeUpdateRequest $request, $id)
    {
        $request['id'] = $id;
        return $this->updateStoreNotice($request);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return StoreNotice
     * @throws MarvelException
     */
    public function updateStoreNotice(Request $request)
    {
        $id = $request->id;
        try {
            $storeNotice = $this->repository->findOrFail($id);
            $permissionArr = $storeNotice->creator->getPermissionNames();

            if (!$request->user()->hasAllPermissions($permissionArr)) {
                return response()->json(['message' => NOT_AUTHORIZED], 403);
            }
            return $this->repository->updateStoreNotice($request, $storeNotice);
        } catch (Exception $e) {
            return response()->json(['message' => NOT_FOUND], 404);
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param Request $request
     * @param $id
     * @return bool
     * @throws MarvelException
     */
    public function destroy(Request $request, $id)
    {

        $request['id'] = $id ?? 0;
        return $this->deleteStoreNotice($request);
    }

    /**
     * Remove the specified resource from storage.
     * @param Request $request
     * @return mixed
     * @throws MarvelException
     */
    public function deleteStoreNotice(Request $request)
    {
        try {
            $id = $request->id;
            return $this->repository->findOrFail($id)->forceDelete();
        } catch (Exception $e) {
            return response()->json(['message' => NOT_FOUND], 404);
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     *  Update the specified resource in storage.
     * This method will update read_status of a single StoreNotice for requested user { id in requestBody }.
     * @param Request $request 
     * @return JsonResponse|null
     * @throws MarvelException
     */
    public function readNotice(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:Marvel\Database\Models\StoreNotice,id'
        ]);
        return $this->repositoryPivot->readSingleNotice($request);
    }

    /**
     *  Update or Store resources in storage.
     * This method will update read_status of a multiple StoreNotice for requested user { array of id in requestBody }.
     * @param Request $request 
     * @return JsonResponse|null
     * @throws MarvelException
     */
    public function readAllNotice(Request $request)
    {
        $request->validate([
            'notices' => 'required|array|min:1',
            'notices.*' => 'exists:Marvel\Database\Models\StoreNotice,id',
        ]);
        return $this->repositoryPivot->readAllNotice($request);
    }
}
